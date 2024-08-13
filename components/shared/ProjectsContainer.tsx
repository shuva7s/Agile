"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchProjects } from "@/lib/actions/project.actions";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { IProject } from "@/lib/database/models/project.model";
import ProjectCardLoad from "./ProjectCardLoad";

type ProjectsContainerProps = {
  type: "hosted" | "working";
};

const ProjectsContainer = ({ type }: ProjectsContainerProps) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch projects on initial load and when `type` changes
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const { projects: fetchedProjects, hasMoreProjects } =
          await fetchProjects(type, 1, 5); // Always fetch the first page
        if (isMounted) {
          setProjects(fetchedProjects);
          setHasMoreProjects(hasMoreProjects);
          setPage(1); // Reset to the first page
        }
      } catch (error) {
        console.error("Error fetching data SERVER ACTION PROJECTS:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [type]); // Fetch data only when `type` changes

  // Function to handle pagination and loading more projects
  const handleShowMore = async () => {
    setLoadingMore(true); // Set loadingMore to true when loading more projects
    const nextPage = page + 1;
    try {
      const { projects: moreProjects, hasMoreProjects } = await fetchProjects(
        type,
        nextPage,
        5
      );
      setProjects((prevProjects) => [...prevProjects, ...moreProjects]);
      setPage(nextPage);
      setHasMoreProjects(hasMoreProjects);
    } catch (error) {
      console.error("Error fetching more projects:", error);
    } finally {
      setLoadingMore(false); // Set loadingMore to false after loading more projects
    }
  };

  return (
    <div className="mx-1 sm:wrapper grid grid-cols-1 sm:auto-grid gap-4 min-h-[40vh] items-start">
      {loading && <ProjectCardLoad count={5} />}
      {!loading && projects.length > 0 && (
        <>
          {projects.map((project) => (
            <Link
              href={`/project/${project._id.toString()}`}
              key={project._id.toString()}
            >
              <Card className="min-h-40 bg-border/15 hover:border-primary/25 transition-all">
                <CardHeader>
                  <CardTitle>{project.projectName}</CardTitle>
                  <CardDescription>
                    {project.projectDescription}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {loadingMore && <ProjectCardLoad count={5} />}
        </>
      )}
      {!loading && projects.length === 0 && <p>No Projects to Show.</p>}
      {!loading && hasMoreProjects && (
        <div className="min-h-40 flex justify-center items-center">
          <Button variant="link" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsContainer;

