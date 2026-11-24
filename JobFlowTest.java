package com.workspark;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class JobFlowTest {

    @Autowired MockMvc mvc;

    @Test
    @WithMockUser(roles = "JOB_SEEKER")
    void jobListIsPaginated() throws Exception {
        mvc.perform(get("/api/jobs?page=0&size=5"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content").isArray())
           .andExpect(jsonPath("$.totalPages").exists());
    }

    @Test
    @WithMockUser(roles = "JOB_SEEKER")
    void seekerCannotApproveJobs() throws Exception {
        mvc.perform(post("/api/admin/jobs/1/approve").with(csrf()))
           .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanApproveJobs() throws Exception {
        mvc.perform(post("/api/admin/jobs/1/approve").with(csrf()))
           .andExpect(status().is2xxSuccessful());
    }
}

// Add a second class with @ActiveProfiles("prod") (+ Testcontainers PostgreSQL) asserting:
//   GET /h2-console  -> 403 or 404
