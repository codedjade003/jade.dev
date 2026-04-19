export default function Experience() {
  const experiences = [
    {
      title: "IT Intern",
      place: "National Defence College (NDC) Abuja",
      date: "Mar – Sep 2023",
      description:
        "Shadowed IT professionals during infrastructure maintenance and gained exposure to system setups, data handling, and digital archiving. Sparked early interest in software development.",
    },
    {
      title: "Research Assistant",
      place: "Public Health Project (Remote/On-site)",
      date: "Jun 2023 – Jul 2024, continuing Feb 2025",
      description:
        "Supported research on 'Knowledge, Attitude and Preventive Practices of Lassa Fever among Health Care Workers.' Contributed to data collection, SPSS analysis, and final project publication.",
    },
    {
      title: "Media & Tech Volunteer",
      place: "Church Ministry, Abuja",
      date: "Ongoing",
      description:
        "Provided technical support during services and events. Assisted with basic media editing and web research for sermons and outreach initiatives.",
    },
    {
      title: "Freelance Web Developer",
      place: "Remote",
      date: "Jun 2025 – Present",
      description:
        "Building dynamic web applications using MERN stack. Collaborated with designers to build premium real estate website (stellehomes.com) and film festival website (arewafilmestival.com).",
    },
    {
      title: "ICT Support Specialist",
      place: "Nigerian Television Authority (NTA) Abuja",
      date: "Jun – Aug 2025",
      description:
        "3-month internship supporting media and tech team with IT tasks and social media content editing. Assisted with day-to-day tech troubleshooting and internal digital support.",
    },
    {
      title: "ICT and Media Specialist",
      place: "Faith Academy Day Secondary School, Jahi",
      date: "Sep 2025 – Present",
      current: true,
      description:
        "Setup and maintenance of computer systems. Troubleshooting technical issues and providing IT support. Creating and managing school media (flyers, videos, pictures).",
    },
    {
      title: "NYSC Software Engineering Intern",
      place: "National Information Technology Development Agency (NITDA), Nigeria",
      date: "Dec 2025 – Present",
      current: true,
      description:
        "Learning and building with fellow tech professionals at NITDA. Assisting assigned mentor and carrying out personal development tasks.",
    },
    {
      title: "Software Engineer & Lead Tech Tutor",
      place: "Techxagon Academy x Salem Academy",
      date: "Jan 2026 – Present",
      current: true,
      description:
        "Resourceful Software Engineer at TechxagonAcademy (EduTech bringing Africa's first 4IR curriculum to schools). Web Design and Development Tech Instructor for students. Building curriculum and managing Tech Lab infrastructure.",
    },
  ];

  const softSkills = [
    "JavaScript & TypeScript",
    "React & Node.js",
    "Data Analysis (SPSS, Excel)",
    "Communication",
    "Problem Solving",
    "Teamwork",
  ];

  const futureGoals = [
    "Senior Fullstack Engineer",
    "Lead Tech Teams",
    "AI-Powered Products",
    "Open Source Contributions",
    "Tech Mentorship",
    "Remote Leadership Roles",
  ];

  return (
    <section
      id="experience"
      className="min-h-screen px-4 sm:px-6 py-16 bg-transparent text-blue-900 dark:text-blue-200 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <h2 data-reveal="left" className="text-3xl font-bold mb-8 text-left">Experience & Growth Journey</h2>

        {/* Soft Skills */}
        <div data-reveal="right" style={{ "--reveal-delay": "80ms" }} className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-left">Skills Beyond Code</h3>
          <ul className="flex flex-wrap gap-3 text-sm sm:text-base">
            {softSkills.map((skill, i) => (
              <li
                key={i}
                data-reveal="up"
                style={{ "--reveal-delay": `${120 + i * 45}ms` }}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full font-medium"
              >
                ✅ {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-10">
          {experiences.map((exp, i) => (
            <div
              key={i}
              data-reveal={i % 2 === 0 ? "left" : "right"}
              style={{ "--reveal-delay": `${140 + i * 55}ms` }}
              className="relative group transition"
            >
              {/* Dot */}
              <div
                aria-hidden="true"
                className={`absolute -left-3 sm:-left-3.5 top-1 w-3.5 h-3.5 rounded-full border-[3px] ${
                  exp.current
                    ? "bg-red-500 border-white dark:border-[#1b1b2f]"
                    : "bg-blue-700 dark:bg-blue-400 border-white dark:border-[#1b1b2f]"
                }`}
              />
              {/* Line */}
              <div
                className={`absolute left-0 top-5 h-full ${
                  exp.current
                    ? "border-l-2 border-red-300 dark:border-red-600"
                    : "border-l-2 border-blue-300 dark:border-blue-600"
                }`}
              />
              {/* Content */}
              <div className="pl-4 sm:pl-5">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold">
                    {exp.title}
                  </h4>
                  {exp.current && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-sm text-blue-500 dark:text-blue-300 block mb-2">
                  {exp.place} • {exp.date}
                </span>
                <p className="text-slate-700 dark:text-blue-300 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Future Goals */}
        <div data-reveal="up" style={{ "--reveal-delay": "140ms" }} className="mt-16 text-left">
          <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">
            This Is The Vision 🌱
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm sm:text-base">
            {futureGoals.map((goal, i) => (
              <li
                key={i}
                data-reveal="zoom"
                style={{ "--reveal-delay": `${180 + i * 45}ms` }}
                className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded shadow-sm"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div data-reveal="right" style={{ "--reveal-delay": "220ms" }} className="mt-12 text-left">
          <h3 className="text-xl font-semibold text-red-500">Let’s Build Something</h3>
          <p className="text-slate-700 dark:text-blue-300 mt-2 text-sm sm:text-base">
            My journey may look unconventional, but every step has added to my skill set.
            I’m ready for real-world challenges — freelance work, junior roles, internships, or even referrals.
          </p>
        </div>
      </div>
    </section>
  );
}
