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
  console.log('Course and assignment group IDs match.')

  // Process each learner's submissions
  const result = submissions.reduce((acc, submission) => {
    const learnerId = submission.learnerId
    const assignment = ag.assignments.find(
      (a) => a.assignmentId === submission.assignmentId
    )

    // Skip irrelevant submissions (assignments not yet due)
    if (!assignment || new Date(assignment.dueAt) > currentDate) {
      console.log(
        `Skipping assignment ${submission.assignmentId} for learner ${learnerId} (not yet due)`
      )
      return acc
    }

    console.log(
      `Processing submission for learner ${learnerId}, assignment ${assignment.assignmentId}`
    )

    // Initialize learner entry in acc if it doesn't exist
    if (!acc[learnerId]) {
      acc[learnerId] = { id: learnerId, totalScore: 0, totalPoints: 0, avg: 0 }
      console.log(`Initializing data for learner ${learnerId}`)
    }

    // Calculate score with late penalty if necessary
    let score = submission.submission.score
    const isLate =
      new Date(submission.submission.submittedAt) > new Date(assignment.dueAt)
    if (isLate) {
      console.log(
        `Late submission detected for learner ${learnerId}, assignment ${assignment.assignmentId}`
      )
      score -= assignment.pointsPossible * 0.1 // Deduct 10% if late
      console.log(`Applying late penalty. Adjusted score: ${score}`)
    }

    // Calculate percentage score and store it by assignment ID
    const percentage = score / assignment.pointsPossible
    acc[learnerId][assignment.assignmentId] = percentage // Store percentage by assignment ID
    console.log(
      `Learner ${learnerId}, assignment ${
        assignment.assignmentId
      } score percentage: ${percentage.toFixed(2)}`
    )

    // Update totalScore and totalPoints for average calculation
    acc[learnerId].totalScore += score
    acc[learnerId].totalPoints += assignment.pointsPossible
    console.log(
      `Updated total score for learner ${learnerId}: ${acc[learnerId].totalScore}`
    )
    console.log(
      `Updated total points for learner ${learnerId}: ${acc[learnerId].totalPoints}`
    )

    // Calculate weighted average
    acc[learnerId].avg = acc[learnerId].totalScore / acc[learnerId].totalPoints
    console.log(
      `Updated average for learner ${learnerId}: ${acc[learnerId].avg.toFixed(
        2
      )}`
    )

    return acc
  }, {}) // Start with an empty object as the initial value

  // Use a for...in loop to filter out learners with low scores
  for (const learnerId in result) {
    if (result[learnerId].avg < 0.5) {
      // Assuming we want to remove learners with an average below 50%
      console.log(
        `Removing learner ${learnerId} from results due to low average score: ${result[
          learnerId
        ].avg.toFixed(2)}`
      )
      delete result[learnerId] // Remove learner from results
      continue // Skip to the next learner
    }
  }

  // Convert the result object to an array
  console.log('Final processed data:', Object.values(result))
  return Object.values(result)
}

// Example Usage
try {
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
  console.log('Result:', result)
} catch (error) {
  console.error('An error occurred:', error.message)
}
