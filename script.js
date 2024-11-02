// Course Information
// This object stores information about the course. `courseId` is a unique identifier,
// and `name` is the name of the course.
const CourseInfo = {
  courseId: 1,
  name: 'Advanced JavaScript',
}

// Assignment Group
// This object represents a group of assignments that belong to the course.
// It includes the course ID it’s linked to (`courseId`), the weight of this group in the course,
// and an array of individual assignments.
const AssignmentGroup = {
  groupId: 10,
  name: 'JavaScript Mastery',
  courseId: 1, // This links to the course by ID
  groupWeight: 30, // A number representing how important this group is in the course grading
  assignments: [
    {
      assignmentId: 101,
      name: 'Master Loops',
      dueAt: '2024-06-15', // Due date for this assignment
      pointsPossible: 100, // Maximum points a student can earn
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
// This is an array that contains all the data about students’ submissions.
// Each submission has a learner ID, the assignment ID it belongs to, and the submission details,
// which include when it was submitted and the score the student received.
const LearnerSubmissions = [
  {
    learnerId: 201,
    assignmentId: 101,
    submission: {
      submittedAt: '2024-06-15', // When the assignment was turned in
      score: 100, // Score earned by the student
    },
  },
  {
    learnerId: 201,
    assignmentId: 102,
    submission: {
      submittedAt: '2024-07-25', // late submission
      score: 150,
    },
  },
  // More submissions follow...
]

// Main Function to Process Learner Data
// This function takes three inputs: course details, assignment group details, and all submissions.
// It processes the submissions to calculate each student's average score, and applies penalties if late.
function getLearnerData(course, ag, submissions) {
  const currentDate = new Date() // Gets the current date and time

  // Check if the assignment group is linked to the correct course by ID
  if (course.courseId !== ag.courseId) {
    throw new Error('Assignment group does not match course ID.')
  }
  console.log('Course and assignment group IDs match.')

  // This part processes each student's submission data
  const result = submissions.reduce((acc, submission) => {
    const learnerId = submission.learnerId // Gets the student's ID
    const assignment = ag.assignments.find(
      (a) => a.assignmentId === submission.assignmentId // Finds the correct assignment
    )

    // If assignment is not due yet, we skip processing it
    if (!assignment || new Date(assignment.dueAt) > currentDate) {
      console.log(
        `Skipping assignment ${submission.assignmentId} for learner ${learnerId} (not yet due)`
      )
      return acc
    }

    console.log(
      `Processing submission for learner ${learnerId}, assignment ${assignment.assignmentId}`
    )

    // If this student isn’t in the accumulator yet, we add them with initial values
    if (!acc[learnerId]) {
      acc[learnerId] = { id: learnerId, totalScore: 0, totalPoints: 0, avg: 0 }
      console.log(`Initializing data for learner ${learnerId}`)
    }

    // Start with the student's raw score
    let score = submission.submission.score
    const isLate =
      new Date(submission.submission.submittedAt) > new Date(assignment.dueAt) // Checks if late
    if (isLate) {
      console.log(
        `Late submission detected for learner ${learnerId}, assignment ${assignment.assignmentId}`
      )
      score -= assignment.pointsPossible * 0.1 // Deducts 10% for being late
      console.log(`Applying late penalty. Adjusted score: ${score}`)
    }

    // Calculate the percentage score for this assignment
    const percentage = score / assignment.pointsPossible
    acc[learnerId][assignment.assignmentId] = percentage // Store it by assignment ID
    console.log(
      `Learner ${learnerId}, assignment ${
        assignment.assignmentId
      } score percentage: ${percentage.toFixed(2)}`
    )

    // Update total score and total points for this student
    acc[learnerId].totalScore += score
    acc[learnerId].totalPoints += assignment.pointsPossible
    console.log(
      `Updated total score for learner ${learnerId}: ${acc[learnerId].totalScore}`
    )
    console.log(
      `Updated total points for learner ${learnerId}: ${acc[learnerId].totalPoints}`
    )

    // Calculate the average score for the learner
    acc[learnerId].avg = acc[learnerId].totalScore / acc[learnerId].totalPoints
    console.log(
      `Updated average for learner ${learnerId}: ${acc[learnerId].avg.toFixed(
        2
      )}`
    )

    return acc // Returns the updated data for this student to the accumulator
  }, {}) // Start with an empty object as the accumulator

  // Use a loop to remove learners who have a low average score
  for (const learnerId in result) {
    if (result[learnerId].avg < 0.5) {
      console.log(
        `Removing learner ${learnerId} from results due to low average score: ${result[
          learnerId
        ].avg.toFixed(2)}`
      )
      delete result[learnerId] // Deletes the entry for this learner
      continue // Skip to the next learner
    }
  }

  // Convert the final result object to an array and return it
  console.log('Final processed data:', Object.values(result))
  return Object.values(result)
}

// Example Usage
// This block runs the function and catches any errors if they occur
try {
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions)
  console.log('Result:', result) // Outputs the final data after processing
} catch (error) {
  console.error('An error occurred:', error.message) // Prints any error messages
}
