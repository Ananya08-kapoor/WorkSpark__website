package com.workspark;

// Reference snippet - adapt names to your Job entity / service.
//
// Repository:
//   Page<Job> findByStatusAndTitleContainingIgnoreCase(JobStatus status, String title, Pageable pageable);
//
// Controller:
//   @GetMapping("/api/jobs")
//   public Page<JobDto> list(
//       @RequestParam(defaultValue = "") String q,
//       @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
//     int size = Math.min(pageable.getPageSize(), 50);               // cap page size
//     return jobService.search(q, PageRequest.of(pageable.getPageNumber(), size, pageable.getSort()));
//   }
//
// Apply the same Pageable pattern to: admin approval queue, employer applicants, seeker "my applications".
// Response shape: content, totalElements, totalPages, number, last.
