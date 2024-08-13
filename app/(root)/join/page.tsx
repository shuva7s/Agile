import { JoinProjectForm } from "@/components/shared/JoinProjectForm";

const JoinPage = () => {
  return (
    <main className="min-h-screen">
      <div className="wrapper">
        <h2 className="text-2xl font-semibold">Join Project</h2>
        <JoinProjectForm></JoinProjectForm>
      </div>
    </main>
  );
};

export default JoinPage;
