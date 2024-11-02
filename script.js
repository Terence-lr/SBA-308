// Course Information
const CourseInfo = {
  id: 678,
  name: 'Advanced JavaScript',
}

// Assignment Group
const AssignmentGroup = {
  id: 98765,
  name: 'JavaScript Mastery',
  course_id: 678,
  group_weight: 30,
  assignments: [
    {
      id: 101,
      name: 'Master Loops',
      due_at: '2024-06-15',
      points_possible: 100,
    },
    {
      id: 102,
      name: 'DOM Manipulation',
      due_at: '2024-07-20',
      points_possible: 200,
    },
    {
      id: 103,
      name: 'Async Programming',
      due_at: '2024-12-01',
      points_possible: 300,
    },
  ],
}

// Learner Submission Data
const LearnerSubmissions = [
  {
    learner_id: 201,
    assignment_id: 101,
    submission: {
      submitted_at: '2024-06-15',
      score: 95,
    },
  },
  {
    learner_id: 201,
    assignment_id: 102,
    submission: {
      submitted_at: '2024-07-21', // late
      score: 180,
    },
  },
  {
    learner_id: 201,
    assignment_id: 103,
    submission: {
      submitted_at: '2024-11-29',
      score: 260,
    },
  },
  {
    learner_id: 202,
    assignment_id: 101,
    submission: {
      submitted_at: '2024-06-13',
      score: 85,
    },
  },
  {
    learner_id: 202,
    assignment_id: 102,
    submission: {
      submitted_at: '2024-07-19',
      score: 190,
    },
  },
  {
    learner_id: 202,
    assignment_id: 103,
    submission: {
      submitted_at: '2024-12-03', // late
      score: 250,
    },
  },
]
// Main Function to Process Learner Data
function getLearnerData(course, ag, submissions) {
  const result = []
  const currentDate = new Date()

  // Ensure Assignment Group matches the Course ID
  if (course.id !== ag.course_id) {
    throw new Error('Assignment group does not match course ID.')
  }

  // Process each learner's submissions
  submissions.reduce((acc, submission) => {
    const learnerId = submission.learner_id
    const assignment = ag.assignments.find(
      (a) => a.id === submission.assignment_id
    )

    // Skip irrelevant submissions (assignments not yet due)
    if (!assignment || new Date(assignment.due_at) > currentDate) {
      return acc
    }

    // Calculate score with late penalty if necessary
    let score = submission.submission.score
    const isLate =
      new Date(submission.submission.submitted_at) > new Date(assignment.due_at)
    if (isLate) score -= assignment.points_possible * 0.1 // Deduct 10% if late

    // Calculate percentage score
    const percentage = score / assignment.points_possible

    return acc
  }, {}) // Provide an initial value for acc
}
// Add or update learner data in accumulator
if (!acc[learnerId]) {
  acc[learnerId] = { id: learnerId, totalScore: 0, totalPoints: 0, avg: 0 }
}
acc[learnerId][assignment.id] = percentage // Store percentage by assignment ID
acc[learnerId].totalScore += score
acc[learnerId].totalPoints += assignment.points_possible
