/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== PROJECT PARAMS

declare type CreateProjectParams = {
  hostClerkId: string;
  projectName: string;
  projectDescription: string;
  people: string[];
  logs: ILog[]; // Array of logs
  todo: ITask[]; // Array of tasks for todo
  inProgress: ITask[]; // Array of tasks for in-progress
  testing: ITask[]; // Array of tasks for testing
  done: ITask[]; // Array of tasks for done
  joinRequests: string[]; // Array of clerk User IDs for join requests
  createdAt: Date;
  updatedAt: Date;
};

// ====== URL QUERY PARAMS
//   declare type FormUrlQueryParams = {
//     searchParams: string;
//     key: string;
//     value: string | number | null;
//   };

//   declare type UrlQueryParams = {
//     params: string;
//     key: string;
//     value: string | null;
//   };

//   declare type RemoveUrlQueryParams = {
//     searchParams: string;
//     keysToRemove: string[];
//   };

//   declare type SearchParamProps = {
//     params: { id: string; type: TransformationTypeKey };
//     searchParams: { [key: string]: string | string[] | undefined };
//   };
