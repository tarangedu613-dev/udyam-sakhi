package com.udayamsakhi.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.udayamsakhi.backend.model.User;
import com.udayamsakhi.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // REGISTER
    // =========================
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(String email, String password) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        if (!password.equals(user.get().getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user.get();
    }

    // =========================
    // GET USER BY ID
    // =========================
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // =========================
    // GET ALL USERS
    // =========================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // =========================
    // UPDATE USER
    // =========================
    public User updateUser(String id, User updatedUser) {

        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User existingUser = user.get();

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setBusinessName(updatedUser.getBusinessName());
        existingUser.setBusinessType(updatedUser.getBusinessType());
        existingUser.setUdyamNumber(updatedUser.getUdyamNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setCity(updatedUser.getCity());
        existingUser.setState(updatedUser.getState());

        return userRepository.save(existingUser);
    }

    // =========================
    // DELETE USER
    // =========================
    public void deleteUser(String id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }
}