// Course Information
const CourseInfo = {
  courseId: 1,
  name: 'Advanced JavaScript',
}

// Assignment Group
const AssignmentGroup = {
  groupId: 10,
  name: 'JavaScript Mastery',
  courseId: 1,
  groupWeight: 30,
  assignments: [
    {
      assignmentId: 101,
      name: 'Master Loops',
      dueAt: '2024-06-15',
      pointsPossible: 100,
    },
    {
      assignmentId: 102,
      name: 'DOM Manipulation',
      dueAt: '2024-07-20',
      pointsPossible: 200,
    },
    {
      assignmentId: 103,
      name: 'Async Programming',
      dueAt: '2024-12-01',
      pointsPossible: 300,
    },
  ],
}

// Learner Submission Data
const LearnerSubmissions = [
  {
    learnerId: 201,
    assignmentId: 101,
    submission: {
      submittedAt: '2024-06-15',
      score: 100,
    },
  },
  {
    learnerId: 201,
    assignmentId: 102,
    submission: {
      submittedAt: '2024-07-25', // late
      score: 150,
    },
  },
  {
    learnerId: 201,
    assignmentId: 103,
    submission: {
      submittedAt: '2024-11-29',
      score: 280,
    },
  },
  {
    learnerId: 202,
    assignmentId: 101,
    submission: {
      submittedAt: '2024-06-12',
      score: 90,
    },
  },
  {
    learnerId: 202,
    assignmentId: 102,
    submission: {
      submittedAt: '2024-07-19',
      score: 200,
    },
  },
  {
    learnerId: 202,
    assignmentId: 103,
    submission: {
      submittedAt: '2024-12-05', // late
      score: 270,
    },
  },
]

// Main Function to Process Learner Data
function getLearnerData(course, ag, submissions) {
  const currentDate = new Date()

  // Ensure Assignment Group matches the Course ID
  if (course.courseId !== ag.courseId) {
    throw new Error('Assignment group does not match course ID.')
  }

  // Process each learner's submissions
  const result = submissions.reduce((acc, submission) => {
    const learnerId = submission.learnerId
    const assignment = ag.assignments.find(
      (a) => a.assignmentId === submission.assignmentId
    )

    // Skip irrelevant submissions (assignments not yet due)
    if (!assignment || new Date(assignment.dueAt) > currentDate) {
      return acc
    }

    // Initialize learner entry in acc if it doesn't exist
    if (!acc[learnerId]) {
      acc[learnerId] = { id: learnerId, totalScore: 0, totalPoints: 0, avg: 0 }
    }

    // Calculate score with late penalty if necessary
    let score = submission.submission.score
    const isLate =
      new Date(submission.submission.submittedAt) > new Date(assignment.dueAt)
    if (isLate) score -= assignment.pointsPossible * 0.1 // Deduct 10% if late

    // Calculate percentage score and store it by assignment ID
    const percentage = score / assignment.pointsPossible
    acc[learnerId][assignment.assignmentId] = percentage // Store percentage by assignment ID

    // Update totalScore and totalPoints for average calculation
    acc[learnerId].totalScore += score
    acc[learnerId].totalPoints += assignment.pointsPossible

    // Calculate weighted average
    acc[learnerId].avg = acc[learnerId].totalScore / acc[learnerId].totalPoints

    return acc
  }, {}) // Start with an empty object as the initial value

  // Convert the result object to an array
  return Object.values(result)
}

// Example Usage
try {
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
  console.log(result)
} catch (error) {
  console.error('An error occurred:', error.message)
}
