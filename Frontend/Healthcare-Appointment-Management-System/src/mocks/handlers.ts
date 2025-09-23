// handlers.ts
import { http, HttpResponse } from "msw";
import {
  doctors,
  patients,
  appointments,
  notifications,
  consultations,
} from "../mocks(data)/data";

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp?: number;
  refresh?: boolean;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const base64Encode = (data: any): string => {
  const json = JSON.stringify(data);
  const uint8Array = new TextEncoder().encode(json);
  let binary = "";
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/=/g, "");
};

const base64Decode = <T>(b64: string): T => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json) as T;
};

const generateToken = (payload: JwtPayload, expiresIn: string): string => {
  const now = Math.floor(Date.now() / 1000);
  let exp = now;

  if (expiresIn.endsWith("d")) {
    exp += parseInt(expiresIn) * 24 * 60 * 60;
  } else if (expiresIn.endsWith("h")) {
    exp += parseInt(expiresIn) * 60 * 60;
  } else if (expiresIn.endsWith("m")) {
    exp += parseInt(expiresIn) * 60;
  } else {
    exp += 15 * 60; // default 15 minutes
  }

  const header = base64Encode({ alg: "HS256", typ: "JWT" });
  const body = base64Encode({ ...payload, exp });
  const signature = "mockedsignature";
  return `${header}.${body}.${signature}`;
};

const generateTokenPair = (payload: JwtPayload): TokenPair => {
  return {
    accessToken: generateToken(payload, "15m"),
    refreshToken: generateToken({ ...payload, refresh: true }, "7d"),
  };
};

const decodeFakeJWT = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split(".");
    return base64Decode<JwtPayload>(payload);
  } catch {
    return null;
  }
};

const validateJWT = (request: Request): JwtPayload | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const payload = decodeFakeJWT(token);

  if (!payload?.exp) return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) return null;

  return payload;
};

const refreshTokens: Record<string, string> = {};

export const handlers = [
  // ================= AUTH =================
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    const user = [...doctors, ...patients].find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const role = doctors.some((d) => d.id === user.id) ? "doctor" : "patient";
    const payload: JwtPayload = { id: user.id, email: user.email, role };
    const tokens = generateTokenPair(payload);

    /**Stores the refresh token in a dictionary (refreshTokens) with the user ID as the value.
                This allows tracking and validating refresh tokens later. */
    refreshTokens[tokens.refreshToken] = user.id.toString();

    return HttpResponse.json({
      message: "Login successful",
      status: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        demo_image: user.demo_image,
      },
      tokens,
    });
  }),

  http.post("/api/auth/refresh", async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    if (!refreshToken || !refreshTokens[refreshToken]) {
      return HttpResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const payload = decodeFakeJWT(refreshToken);
    if (!payload?.refresh) {
      return HttpResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const userId = refreshTokens[refreshToken];
    const user = [...doctors, ...patients].find(
      (u) => u.id.toString() === userId
    );
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    const role = doctors.some((d) => d.id === user.id) ? "doctor" : "patient";
    const newPayload: JwtPayload = { id: user.id, email: user.email, role };
    const tokens = generateTokenPair(newPayload);

    delete refreshTokens[refreshToken];
    refreshTokens[tokens.refreshToken] = user.id.toString();

    // Send both tokens again
    return HttpResponse.json({
      message: "Token refreshed",
      status: true,
      tokens,
    });
  }),

  http.post("/api/auth/logout", async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken: string };

    if (refreshToken && refreshTokens[refreshToken]) {
      delete refreshTokens[refreshToken];
    }

    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  /* ============Docotors Handlers============== */

  // Get all doctors
  http.get("/api/doctors/all", () => HttpResponse.json(doctors)),

  // Get doctor by id (protected route)
  http.get("/api/doctors/:id", ({ params, request }) => {
    // Check for Authorization header and validate token
    const payload = validateJWT(request);

    if (!payload) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const doctorId = params.id;
    const doctor = doctors.find((d) => d.id.toString() === doctorId);
    if (!doctor) {
      return HttpResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(doctor);
  }),

  http.put("/api/doctors/:id", async ({ params, request }) => {
    const user = validateJWT(request);
    if (!user || user.role !== "doctor" || user.id !== Number(params.id)) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idx = doctors.findIndex((d) => d.id === Number(params.id));
    if (idx === -1)
      return HttpResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );

    const updates = await request.json();
    doctors[idx] = { ...doctors[idx], ...updates };
    return HttpResponse.json(doctors[idx]);
  }),

  //==============Patient handlers ===========

  // Get consultations for a specific patient
  http.get("/api/consultations", ({ request }) => {
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patientId");

    if (!patientId) {
      return HttpResponse.json(consultations, { status: 200 });
    }

    const filtered = consultations.filter(
      (c) => c.patientId === Number(patientId)
    );
    return HttpResponse.json(filtered, { status: 200 });
  }),

  // Get doctors
  http.get("/api/doctors", () => {
    return HttpResponse.json(doctors, { status: 200 });
  }),

  http.get("/api/patient", ({ request }) => {
    return HttpResponse.json(patients);
  }),

  http.get("/api/consultations", ({ request }) => {
    return HttpResponse.json(consultations);
  }),

  http.post("/api/consultant-record", async ({ request }) => {
    const body = (await request.json()) as Record<string, any>;
    const date = Date.now();

    type consultations = (typeof consultations)[number];

    const newRecord: consultations = {
      id: `CID${date}`,
      appointmentId: body.appointmentId ?? date, // or generate
      patientId: body.patientId ?? "",
      doctorId: body.doctorId ?? 0,
      date: date.toString(),
      symptoms: body.symptoms ?? "",
      bloodPressure: body.bloodPressure ?? 0,
      height: body.height ?? 0,
      weight: body.weight ?? 0,
      description: body.description ?? "",
      notes: body.notes ?? "",
      prescription: body.prescription ?? [],
      followUpDate: body.followUpDate ?? null,
      status: body.status ?? "pending",
    };

    consultations.push(newRecord);

    return HttpResponse.json(newRecord, { status: 201 });
  }),

  /** ===========================Appointment Handlers========================== */

  // Get all appointments for a particular doctor (protected route)
  http.get("/api/appointment/doctor/:doctorId", ({ params, request }) => {
    const payload = validateJWT(request);
    if (!payload) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const doctorId = params.doctorId;
    // You may need to import appointments from your data file
    // For now, assuming appointments is available in scope
    const doctorAppointments = (
      typeof appointments !== "undefined" ? appointments : []
    ).filter((a) => a.doctorId?.toString() === doctorId);
    return HttpResponse.json(doctorAppointments);
  }),

  http.get("/api/appointments/patient/:patientId", ({ params, request }) => {
    const user = validateJWT(request);
    if (
      !user ||
      (user.role === "patient" && user.id !== Number(params.patientId))
    ) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json(
      appointments.filter((a) => a.patientId === Number(params.patientId))
    );
  }),

//Appointment book
http.post("/api/appointments", async ({ request }) => {
  const user = validateJWT(request);
  if (!user) {
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = (await request.json()) as {
    doctorId: number;
    date: string;
    time: string;
  };

  // Check if doctor exists
  const doctor = doctors.find((d) => d.id === data.doctorId);
  if (!doctor) {
    return HttpResponse.json(
      { message: "Doctor not found" },
      { status: 404 }
    );
  }

  // Check if slot is available
  const doctorAvailability = doctor.availability.find(
    (a) => a.date === data.date
  );
  if (!doctorAvailability || !doctorAvailability.slots.includes(data.time)) {
    return HttpResponse.json(
      { message: "Selected slot is not available" },
      { status: 400 }
    );
  }

  // Check if slot is already booked
  const existingAppointment = appointments.find(
    (a) =>
      a.doctorId === data.doctorId &&
      a.date === data.date &&
      a.time === data.time &&
      a.status === "BOOKED"
  );

  if (existingAppointment) {
    return HttpResponse.json(
      { message: "Slot already booked" },
      { status: 400 }
    );
  }

  const newAppointment = {
    id: Date.now(),
    patientId: user.id,
    status: "BOOKED",
    ...data,
  };

  appointments.push(newAppointment);
  return HttpResponse.json(newAppointment, { status: 201 });
}),

  http.put("/api/appointments/:id", async ({ params, request }) => {
    const user = validateJWT(request);
    if (!user) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idx = appointments.findIndex((a) => a.id === Number(params.id));
    if (idx === -1) {
      return HttpResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointment = appointments[idx];

    // Authorization check
    if (user.role === "doctor" && appointment.doctorId !== user.id) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (user.role === "patient" && appointment.patientId !== user.id) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    appointments[idx] = { ...appointments[idx], ...updates };
    return HttpResponse.json(appointments[idx]);
  }),

  http.post("/api/appointment/cancel", async ({ request }) => {
    const user = validateJWT(request);
    if (!user) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { appointmentId, userId } = await request.json();
    const idx = appointments.findIndex((a) => a.id === Number(appointmentId));
    if (idx === -1) {
      return HttpResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }
    const appointment = appointments[idx];
    // Authorization: user must be doctor or patient for this appointment
    if (
      (user.role === "doctor" && appointment.doctorId !== user.id) ||
      (user.role === "patient" && appointment.patientId !== user.id)
    ) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    appointments.splice(idx, 1);
    return HttpResponse.json({ message: "Appointment cancelled" });
  }),

  /* http.get("/api/appointments", async ({ request }) => {
      const user = validateJWT(request);
      if (!user) {
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      // Return appointments based on role
      const data =
        user.role === "doctor"
          ? appointments.filter((a) => a.doctorId === user.id)
          : appointments.filter((a) => a.patientId === user.id);
  
      return HttpResponse.json({ appointments: data });
    }),*/

  // Get notifications for a user (protected route)
  http.get("/api/notifications/:userId", ({ params, request }) => {
    const payload = validateJWT(request);
    if (!payload) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = params.userId;
    const userNotifications = notifications.filter(
      (n: any) => n.userId?.toString() === userId
    );
    return HttpResponse.json(userNotifications);
  }),

  /**================Patient Handlers================= */
  http.get("/api/patient/:id", ({ params, request }) => {
    // Check for Authorization header and validate token
    const payload = validateJWT(request);
    if (!payload) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const patientId = params.id;
    const patient = patients.find((d) => d.id.toString() === patientId);
    if (!patient) {
      return HttpResponse.json(
        { message: "patient not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(patient);
  }),

  http.put("/api/patients/:id", async ({ params, request }) => {
    const user = validateJWT(request);
    if (!user || (user.role === "patient" && user.id !== Number(params.id))) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const idx = patients.findIndex((p) => p.id === Number(params.id));
    if (idx === -1)
      return HttpResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      );

    const updates = await request.json();
    patients[idx] = { ...patients[idx], ...updates };
    return HttpResponse.json(patients[idx]);
  }),
  // Get doctor availability by id (protected route)
  http.get("/api/doctor/avalability/:id", ({ params, request }) => {
    const payload = validateJWT(request);
    if (!payload) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const doctorId = params.id;
    const doctor = doctors.find((d) => d.id.toString() === doctorId);
    if (!doctor) {
      return HttpResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(doctor.availability);
  }),
];
