import Link from 'next/link';
import type { ProjectItem } from '@/types';

interface ProjectlistitemProps {
    stack: string;
    projects: ProjectItem[];
}

const Projectlistitem = ({ stack, projects }: ProjectlistitemProps) => {
    return (
        <div className=" prose flex flex-col items-center justify-center dark:prose-invert">
            <h3 className="code text-2xl font-bold">{stack}</h3>
            <div className="">
                {projects.map((project) => (
                    <Link
                        href={`/projects/${project.id}`}
                        key={project.id}
                        className=" flex transition duration-150 hover:text-primary ">
                        {project.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Projectlistitem;
