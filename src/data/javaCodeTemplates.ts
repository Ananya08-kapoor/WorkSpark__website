export const JAVA_CONTROLLER_CODE = `package com.workspark.portal.controller;

import com.workspark.portal.dto.*;
import com.workspark.portal.model.*;
import com.workspark.portal.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller implementing the WorkSpark Enterprise Job & Recruitment Workflow.
 * Manages Job Postings, Admin Approvals, and Candidate Applications.
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class RecruitmentWorkflowController {

    private final JobPostingService jobService;
    private final AdminModerationService adminService;
    private final ApplicationTrackingService applicationService;
    private final NotificationEventPublisher eventPublisher;

    @Autowired
    public RecruitmentWorkflowController(
            JobPostingService jobService,
            AdminModerationService adminService,
            ApplicationTrackingService applicationService,
            NotificationEventPublisher eventPublisher) {
        this.jobService = jobService;
        this.adminService = adminService;
        this.applicationService = applicationService;
        this.eventPublisher = eventPublisher;
    }

    // ==========================================
    // 1. EMPLOYER STEP: POST A JOB (PENDING APPROVAL)
    // ==========================================
    @PostMapping("/jobs")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<JobResponseDto> postJobVacancy(
            @Valid @RequestBody JobCreationRequestDto request,
            @RequestAttribute("authenticatedUserEmail") String employerEmail) {
        
        // Save job with initial status = PENDING_APPROVAL
        JobPosting createdJob = jobService.createJobPost(request, employerEmail);
        
        // Dispatch domain event to notify Admin queue
        eventPublisher.publishJobCreatedEvent(createdJob.getId(), createdJob.getTitle());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(JobResponseDto.fromEntity(createdJob));
    }

    // ==========================================
    // 2. ADMIN STEP: REVIEW & APPROVE / REJECT JOB
    // ==========================================
    @GetMapping("/admin/jobs/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobResponseDto>> getPendingModerationQueue() {
        List<JobPosting> pendingJobs = adminService.getPendingJobs();
        return ResponseEntity.ok(pendingJobs.stream().map(JobResponseDto::fromEntity).toList());
    }

    @PutMapping("/admin/jobs/{jobId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> approveJobPosting(
            @PathVariable String jobId,
            @RequestBody(required = false) ApprovalDecisionDto decision) {
        
        adminService.approveJob(jobId, decision != null ? decision.getNote() : "Approved by Admin");
        eventPublisher.publishJobApprovedEvent(jobId);
        
        return ResponseEntity.ok(new ApiResponse(true, "Job vacancy approved and published to candidate portal"));
    }

    // ==========================================
    // 3. CANDIDATE STEP: SEARCH & APPLY FOR JOB
    // ==========================================
    @GetMapping("/jobs/approved")
    public ResponseEntity<List<JobResponseDto>> searchApprovedJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String department) {
        
        List<JobPosting> jobs = jobService.searchApprovedJobs(keyword, location, department);
        return ResponseEntity.ok(jobs.stream().map(JobResponseDto::fromEntity).toList());
    }

    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<ApplicationResponseDto> submitApplication(
            @PathVariable String jobId,
            @Valid @RequestBody ApplicationSubmissionDto dto) {
        
        JobApplication application = applicationService.submitApplication(jobId, dto);
        eventPublisher.publishApplicationReceivedEvent(jobId, application.getId(), dto.getCandidateName());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApplicationResponseDto.fromEntity(application));
    }

    // ==========================================
    // 4. EMPLOYER STEP: REVIEW APPLICATION & UPDATE STATUS
    // ==========================================
    @PatchMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApplicationResponseDto> updateApplicationStatus(
            @PathVariable String applicationId,
            @Valid @RequestBody ApplicationStatusUpdateDto updateDto) {
        
        JobApplication updated = applicationService.updateStatus(
                applicationId, 
                updateDto.getStatus(), 
                updateDto.getEmployerNotes(),
                updateDto.getInterviewDetails()
        );
        
        eventPublisher.publishStatusChangedEvent(applicationId, updateDto.getStatus());
        return ResponseEntity.ok(ApplicationResponseDto.fromEntity(updated));
    }
}
`;

export const JAVA_ENTITY_CODE = `package com.workspark.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA Entity representing a Job Post in the Postgres / MySQL relational database.
 */
@Entity
@Table(name = "job_postings", indexes = {
    @Index(name = "idx_job_status", columnList = "status"),
    @Index(name = "idx_job_department", columnList = "department")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String company;

    @Column(name = "company_logo_url")
    private String companyLogo;

    @NotBlank
    @Column(nullable = false, length = 80)
    private String department;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private JobType jobType;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "job_responsibilities", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "responsibility_item")
    private List<String> responsibilities;

    @ElementCollection
    @CollectionTable(name = "job_requirements", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "requirement_item")
    private List<String> requirements;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill_tag")
    private List<String> skills;

    @NotBlank
    @Email
    @Column(name = "posted_by_email", nullable = false)
    private String postedByEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private JobStatus status = JobStatus.PENDING_APPROVAL;

    @Column(name = "admin_review_note")
    private String adminReviewNote;

    @OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobApplication> applications;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
`;

export const JAVA_SERVICE_CODE = `package com.workspark.portal.service.impl;

import com.workspark.portal.exception.ResourceNotFoundException;
import com.workspark.portal.model.*;
import com.workspark.portal.repository.*;
import com.workspark.portal.service.RecruitmentWorkflowService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class RecruitmentWorkflowServiceImpl implements RecruitmentWorkflowService {

    private final JobPostingRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final EmailNotificationClient emailClient;

    public RecruitmentWorkflowServiceImpl(
            JobPostingRepository jobRepository,
            JobApplicationRepository applicationRepository,
            EmailNotificationClient emailClient) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.emailClient = emailClient;
    }

    @Override
    public JobPosting createJobPosting(JobPosting job, String employerEmail) {
        job.setStatus(JobStatus.PENDING_APPROVAL);
        job.setPostedByEmail(employerEmail);
        return jobRepository.save(job);
    }

    @Override
    public void approveJobPosting(String jobId, String adminNote) {
        JobPosting job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job with ID " + jobId + " not found"));
        
        job.setStatus(JobStatus.APPROVED);
        job.setAdminReviewNote(adminNote);
        jobRepository.save(job);

        // Notify employer of publication
        emailClient.sendJobApprovedEmail(job.getPostedByEmail(), job.getTitle());
    }

    @Override
    public JobApplication updateApplicationStatus(
            String applicationId, 
            ApplicationStatus newStatus, 
            String employerNote,
            InterviewScheduleVo interview) {
        
        JobApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application " + applicationId + " not found"));

        app.setStatus(newStatus);
        if (employerNote != null && !employerNote.isBlank()) {
            app.setEmployerNotes(employerNote);
        }

        if (newStatus == ApplicationStatus.INTERVIEW_SCHEDULED && interview != null) {
            app.setInterviewDate(interview.getDate());
            app.setInterviewLink(interview.getMeetingLink());
        }

        app.getTimeline().add(ApplicationTimeline.builder()
                .status(newStatus)
                .timestamp(LocalDateTime.now())
                .note(employerNote)
                .build());

        JobApplication saved = applicationRepository.save(app);

        // Real-time applicant alert
        emailClient.sendStatusUpdateEmail(saved.getCandidateEmail(), saved.getJobPosting().getTitle(), newStatus);
        return saved;
    }
}
`;
