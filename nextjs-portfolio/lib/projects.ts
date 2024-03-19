import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { ProjectItem } from "@/types";
import rehypePrettyCode from "rehype-pretty-code";

// Define the directory where project markdown files are located
const projectsDirectory = path.join(process.cwd(), "projects");

// Function to retrieve and sort project data from markdown files
const getSortedProjectsData = (): ProjectItem[] => {
    // Get the list of file names in the projects directory
    const fileNames = fs.readdirSync(projectsDirectory);

    // Map each file to its corresponding project data
    const allProjectsData = fileNames.map((fileName) => {
        // Extract the project ID from the file name
        const id = fileName.replace(/\.md$/, "");
        // Get the full path to the markdown file
        const fullPath = path.join(projectsDirectory, fileName);
        // Read the content of the markdown file
        const fileContents = fs.readFileSync(fullPath, "utf8");
        // Parse the front matter and content from the markdown file
        const matterResult = matter(fileContents);

        // Assemble the project data object
        const projectData: ProjectItem = {
            id,
            name: matterResult.data.name,
            description: matterResult.data.description,
            image: matterResult.data.image,
            url: matterResult.data.url,
            tags: matterResult.data.tags,
            stack: matterResult.data.stack,
            stared: matterResult.data.stared,
            // Format the date using Moment.js
            date: moment(matterResult.data.date).format("MMMM DD, YYYY"),
            github: matterResult.data.github,
            live: matterResult.data.live,
        };

        // Return the project data object
        return projectData;
    });

    // Sort the projects by date in ascending order
    return allProjectsData.sort((a, b) => {
        const format = "DD-MM-YYYY";
        const dateOne = moment(a.date, format);
        const dateTwo = moment(b.date, format);
        if (dateOne.isBefore(dateTwo)) {
            return -1;
        } else if (dateTwo.isAfter(dateOne)) {
            return 1;
        } else {
            return 0;
        }
    });
};

export const getCategoriesdProjectsData = (): Record<string, ProjectItem[]> => {
    const sortedProjects = getSortedProjectsData();
    const categorisedProjects: Record<string, ProjectItem[]> = {};

    sortedProjects.forEach((project) => {
        project.tags.forEach((tag) => {
            if (categorisedProjects[tag]) {
                categorisedProjects[tag].push(project);
            } else {
                categorisedProjects[tag] = [project];
            }
        });
    });
    return categorisedProjects;
}

export const getStarredProjectsData = (): ProjectItem[] => {
    const sortedProjects = getSortedProjectsData();
    const starredProjects: ProjectItem[] = [];

    sortedProjects.forEach((project) => {
        if (project.stared) {
            starredProjects.push(project);
        }
    });
    return starredProjects;
};

export const getProjectData = async (id:string) => {
    const fullPath = path.join(projectsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode,{

        keepBackground: false,
        defaultLang: {
            block: 'plaintext',
            inline: 'plaintext'
        },
        })
    .use(rehypeStringify)
    .process(matterResult.content)

    const projectHtml = processedContent.toString();

    return {
        id,
        name: matterResult.data.name,
        description: matterResult.data.description,
        image: matterResult.data.image,
        url: matterResult.data.url,
        tags: matterResult.data.tags,
        stack: matterResult.data.stack,
        date: moment(matterResult.data.date).format("MMMM DD, YYYY"),
        github: matterResult.data.github,
        live: matterResult.data.live,
        content: projectHtml,
    }

}


