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
  const [isMounted, setIsMounted] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(5); // Initial number of skeletons

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadProjects = async () => {
      const { projects: fetchedProjects, hasMoreProjects } =
        await fetchProjects(type, page, 5);
      setProjects(fetchedProjects);
      setHasMoreProjects(hasMoreProjects);
      setLoading(false);
    };
    loadProjects();
  }, [isMounted, type]);

  const handleShowMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const { projects: moreProjects, hasMoreProjects } = await fetchProjects(
      type,
      nextPage,
      5
    );
    setProjects((prevProjects) => [...prevProjects, ...moreProjects]);
    setPage(nextPage);
    setHasMoreProjects(hasMoreProjects);
    setLoading(false);
    setSkeletonCount((prevCount) => {
      const newCount = prevCount + 5;
      return newCount;
    });
  };

  if (!isMounted) return <ProjectCardLoad count={skeletonCount} />; // Show initial number of skeletons

  return (
    <div className="grid auto-grid gap-3">
      {loading ? (
        <ProjectCardLoad count={skeletonCount} /> // Show updated number of skeletons while loading
      ) : (
        <>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                href={`/project/${project._id.toString()}`}
                key={project._id.toString()}
              >
                <Card className="hover:bg-border/30 transition-all min-h-32">
                  <CardHeader>
                    <CardTitle>{project.projectName}</CardTitle>
                    <CardDescription>
                      {project.projectDescription}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <p>No Projects to Show.</p>
          )}
          {!loading && hasMoreProjects && (
            <div className="min-h-32 flex justify-center items-center">
              <Button variant="link" onClick={handleShowMore}>
                Show More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsContainer;
