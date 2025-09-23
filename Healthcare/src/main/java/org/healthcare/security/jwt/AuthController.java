package org.healthcare.security.jwt;

import lombok.RequiredArgsConstructor;
import org.healthcare.dto.LoginDto;
import org.healthcare.dto.RegisterDoctorDto;
import org.healthcare.dto.RegisterPatientDto;
import org.healthcare.models.Doctor;
import org.healthcare.models.Patient;
import org.healthcare.models.Role;
import org.healthcare.models.User;
import org.healthcare.repository.DoctorRepository;
import org.healthcare.repository.PatientRepository;
import org.healthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import jakarta.validation.Valid;

import java.util.*;



@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:5174")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/public/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody LoginDto loginDto) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(loginDto.getEmail());

        // Check if user exists and the password is correct
        if (userOptional.isPresent() && passwordEncoder.matches(loginDto.getPassword(), userOptional.get().getPassword())) {
            // If credentials are valid, generate a JWT token
            UserDetails userDetails = userOptional.get();
            String jwt = jwtUtils.generateTokenFromUsername(userDetails);

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", userOptional.get().getId());
            userInfo.put("email", userOptional.get().getEmail());
            userInfo.put("role", userOptional.get().getRole().name());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "User signed in successfully!");
            responseBody.put("status", true);
            responseBody.put("token", jwt);
            responseBody.put("user", userInfo);

            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        } else {
            // If credentials are not valid, return a BAD_REQUEST
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Invalid email or password!");
            map.put("status", false);
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }
    }/*
@PostMapping("/public/signin")
public String loginInfo(@Valid @RequestBody LoginDto loginDto){
    String result = loginDto.getEmail()+" "+loginDto.getPassword();
    return result;
}*/


    @PostMapping("/register-patient")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody RegisterPatientDto registerDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Validation failed");
            map.put("errors", new HashMap<>());
            for (FieldError error : bindingResult.getFieldErrors()) {
                ((Map<String, Object>) map.get("errors")).put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Email is already taken!");
            map.put("status", false);
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        // Create user
        User user = User.builder()
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.ROLE_PATIENT)
                .build();

        User savedUser = userRepository.save(user);

        // Create patient profile
        Patient patient = Patient.builder()
                .user(savedUser)
                .name(registerDto.getName())
                .age(registerDto.getAge())
                .bloodGroup(registerDto.getBloodGroup())
                .phoneNumber(registerDto.getPhoneNumber())
                .address(registerDto.getAddress())
                .gender(registerDto.getGender())
                .build();

        patientRepository.save(patient);

        Map<String, Object> map = new HashMap<>();
        map.put("message", "Patient registered successfully!");
        map.put("status", true);
        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }

    @PostMapping("/public/register-doctor")
    public ResponseEntity<?> registerDoctor(@Valid @RequestBody RegisterDoctorDto registerDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Validation failed");
            map.put("errors", new HashMap<>());
            for (FieldError error : bindingResult.getFieldErrors()) {
                ((Map<String, Object>) map.get("errors")).put(error.getField(), error.getDefaultMessage());
            }
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Email is already taken!");
            map.put("status", false);
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }

        // Create user
        User user = User.builder()
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.ROLE_DOCTOR)
                .build();

        User savedUser = userRepository.save(user);



        Doctor doctor = Doctor.builder()
                .user(savedUser)
                .name(registerDto.getName())
                .build();


        doctorRepository.save(doctor);

        Map<String, Object> map = new HashMap<>();
        map.put("message", "Doctor registered successfully!");
        map.put("status", true);
        return new ResponseEntity<>(map, HttpStatus.CREATED);
    }

    // Alias to match frontend path
    @PostMapping("/register-doctor")
    public ResponseEntity<?> registerDoctorAlias(@Valid @RequestBody RegisterDoctorDto registerDto, BindingResult bindingResult) {
        return registerDoctor(registerDto, bindingResult);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> map = new HashMap<>();
        map.put("message", "Logged out successfully");
        map.put("status", true);
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Missing or invalid Authorization header");
            error.put("status", false);
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        String token = authorizationHeader.substring(7);
        if (!jwtUtils.validateJwtToken(token)) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Invalid token");
            error.put("status", false);
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtils.getUserNameFromJwtToken(token);
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "User not found");
            error.put("status", false);
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        UserDetails userDetails = userOptional.get();
        String newToken = jwtUtils.generateTokenFromUsername(userDetails);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", userOptional.get().getId());
        userInfo.put("email", userOptional.get().getEmail());
        userInfo.put("role", userOptional.get().getRole().name());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Token refreshed successfully!");
        responseBody.put("status", true);
        responseBody.put("token", newToken);
        responseBody.put("user", userInfo);

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}