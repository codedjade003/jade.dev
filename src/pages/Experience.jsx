export default function Experience() {
  const experiences = [
    {
      title: "Cybersecurity Intern",
      place: "National Defence College",
      date: "Mar – Aug 2023",
      description:
        "Assisted in organizing and executing a cybersecurity training program. Helped with setup, logistics, and technical support across departments.",
    },
    {
      title: "Data Analyst Assistant",
      place: "PhD Research (Lassa Fever Study)",
      date: "Jan – Feb 2024",
      description:
        "Helped clean and visualize survey data for a public health research project led by a medical lab scientist. Strengthened my analytical and communication skills.",
    },
    {
      title: "Media & Tech Volunteer",
      place: "Living Faith Church, Jahi",
      date: "Apr 2025 – Present",
      description:
        "Gained practical experience in graphics design, live streaming, and visual storytelling through weekly technical service and event support.",
    },
    {
      title: "Remote Junior Developer",
      place: "Startups & Open Source",
      date: "Oct 2025 – Jan 2026",
      description:
        "Contributed to scalable applications and collaborated with remote teams on live production code. Participated in community-led AI and dev tools projects.",
      future: true,
    },
    {
      title: "Technical Specialist",
      place: "Global Dev Company",
      date: "Mar 2026 – Present",
      description:
        "Led key deployments, mentored newer devs, and helped shape open infrastructure standards in the African tech ecosystem.",
      future: true,
    },
  ];

  const softSkills = [
    "Team Collaboration",
    "Data Analysis",
    "Graphic Design",
    "Event Coordination",
    "IT Support",
    "Broadcasting",
  ];

  const futureGoals = [
    "Remote Internships",
    "Junior Dev Roles",
    "Tech Startups",
    "Open Source Projects",
    "Community-led AI Projects",
  ];

  return (
    <section
      id="experience"
      className="min-h-screen px-4 sm:px-6 py-16 bg-white text-blue-900 dark:bg-[#1b1b2f] dark:text-blue-200 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-left">Experience & Growth Journey</h2>

        {/* Soft Skills */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-left">Skills Beyond Code</h3>
          <ul className="flex flex-wrap gap-3 text-sm sm:text-base">
            {softSkills.map((skill, i) => (
              <li
                key={i}
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
            <div key={i} className="relative group transition">
              {/* Dot */}
              <div
                aria-hidden="true"
                className={`absolute -left-3 sm:-left-3.5 top-1 w-3.5 h-3.5 rounded-full border-[3px] ${
                  exp.future
                    ? "bg-blue-300 border-dashed dark:bg-blue-600 border-white dark:border-[#1b1b2f]"
                    : "bg-blue-700 dark:bg-blue-400 border-white dark:border-[#1b1b2f]"
                }`}
              />
              {/* Line */}
              <div
                className={`absolute left-0 top-5 h-full ${
                  exp.future
                    ? "border-l-2 border-dashed border-blue-200 dark:border-blue-600"
                    : "border-l-2 border-blue-300 dark:border-blue-600"
                }`}
              />
              {/* Content */}
              <div className="pl-4 sm:pl-5">
                <h4
                  className={`text-lg font-semibold mb-1 ${
                    exp.future ? "opacity-80 italic" : ""
                  }`}
                >
                  {exp.title}
                </h4>
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
        <div className="mt-16 text-left">
          <h3 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">
            This Is The Vision 🌱
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm sm:text-base">
            {futureGoals.map((goal, i) => (
              <li
                key={i}
                className="bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded shadow-sm"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-left">
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
