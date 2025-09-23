package org.healthcare.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.healthcare.models.Role;
import org.healthcare.models.User;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {
    private Long id;
    private String email;
    private Role role;

    public static UserInfoDto fromUser(User user) {
        return new UserInfoDto(user.getId(), user.getEmail(), user.getRole());
    }
}
