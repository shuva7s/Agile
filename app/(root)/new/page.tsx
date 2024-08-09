import { CreatePostForm } from "@/components/shared/CreateProjectForm";
export default function NewProject() {
  return (
    <section>
      <main>
        <section className="wrapper">
          <h2 className="text-2xl font-semibold">Create New Project</h2>
          <CreatePostForm />
        </section>
      </main>
    </section>
  );
}
