import { gql } from "~/gql";

export const LEARNING_SUBJECTS_QUERY = gql(`
  query silkRoadLearningSubjects {
    silkRoadLearningSubjects {
      id
      name
      description
      gradeRange
      hours
      steps {
        id
        title
        description
        minutes
        activity
      }
    }
  }
`);

export const MY_ROADMAPS_QUERY = gql(`
  query silkRoadMyRoadmaps {
    silkRoadMyRoadmaps {
      _id
      subjectId
      completedStepIds
      updatedAt
      subject {
        id
        name
        description
        gradeRange
        hours
        steps {
          id
          title
          description
          minutes
          activity
        }
      }
      generatedSteps {
        id
        title
        description
        minutes
        activity
      }
      pathHistory {
        id
        sourceFileName
        savedAt
        completedStepIds
        generatedSteps {
          id
          title
          description
          minutes
          activity
        }
      }
      files {
        id
        name
        url
        type
        size
        uploadedAt
      }
    }
  }
`);

export const START_ROADMAP_MUTATION = gql(`
  mutation silkRoadStartRoadmap($subjectId: String!) {
    silkRoadStartRoadmap(subjectId: $subjectId) {
      _id
      subjectId
    }
  }
`);

export const SET_STEP_COMPLETION_MUTATION = gql(`
  mutation silkRoadSetStepCompletion(
    $subjectId: String!
    $stepId: String!
    $completed: Boolean!
  ) {
    silkRoadSetStepCompletion(
      subjectId: $subjectId
      stepId: $stepId
      completed: $completed
    ) {
      _id
      subjectId
      completedStepIds
    }
  }
`);

export const ADD_STUDY_FILE_MUTATION = gql(`
  mutation silkRoadAddStudyFile(
    $subjectId: String!
    $input: SilkRoadStudyFileInput!
  ) {
    silkRoadAddStudyFile(subjectId: $subjectId, input: $input) {
      _id
      subjectId
      files {
        id
        name
        url
        type
        size
        uploadedAt
      }
    }
  }
`);

export const CREATE_ROADMAP_FROM_STUDY_FILE_MUTATION = gql(`
  mutation silkRoadCreateRoadmapFromStudyFile(
    $subjectId: String!
    $input: SilkRoadStudyFileInput!
    $content: String!
  ) {
    silkRoadCreateRoadmapFromStudyFile(
      subjectId: $subjectId
      input: $input
      content: $content
    ) {
      _id
      subjectId
      generatedSteps {
        id
        title
        description
        minutes
        activity
      }
      files {
        id
        name
        url
        type
        size
        uploadedAt
      }
    }
  }
`);
