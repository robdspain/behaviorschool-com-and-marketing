const areas = [
  {
    title: "Assessment",
    body: "Functional behavior assessments and other behavior assessments",
  },
  {
    title: "Data",
    body: "Collect and analyze data on interventions, IEPs and school initiatives",
  },
  {
    title: "Training",
    body: "Supervise staff, coach educators and families",
  },
  {
    title: "Intervention",
    body: "Plans, direct service, classroom management, systems support such as PBIS and MTSS",
  },
] as const;

const partners = [
  "Teachers",
  "Paraprofessionals",
  "Administrators",
  "School psychologists",
  "Speech-language pathologists",
  "Counselors",
  "Families",
] as const;

function Connector({ dashed = false }: { dashed?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={
        dashed
          ? "mx-auto h-4 w-0 border-l-2 border-dashed border-[#1f4d3f]"
          : "mx-auto h-4 w-0.5 bg-[#1f4d3f]"
      }
    />
  );
}

export function SchoolBcbaRoleMap() {
  return (
    <figure className="my-8">
      <p id="school-bcba-role-map-title" className="sr-only">
        School BCBA role map
      </p>
      <p id="school-bcba-role-map-desc" className="sr-only">
        A school BCBA sits at the center of five areas of work: assessment, data, training, intervention and crisis response, and works through teachers, paraprofessionals, administrators, school psychologists, speech-language pathologists, counselors and families.
      </p>
      <div
        role="img"
        aria-labelledby="school-bcba-role-map-title"
        aria-describedby="school-bcba-role-map-desc"
        className="rounded-[12px] border border-[#d9cdb8] bg-white p-4 sm:p-6"
      >
        <div className="mx-auto max-w-xl rounded-[12px] bg-[#1f4d3f] px-4 py-3 text-center text-lg font-semibold leading-snug text-[#fbfaf6]">
          School BCBA
        </div>
        <div className="mx-auto max-w-xl">
          {areas.map((area) => (
            <div key={area.title}>
              <Connector />
              <div className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3">
                <p className="text-lg font-semibold leading-snug text-[#171f1d]">{area.title}</p>
                <p className="mt-1 text-base leading-6 text-[#365548]">{area.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-xl">
          <Connector dashed />
        </div>
        <div className="mx-auto max-w-xl rounded-[12px] border-2 border-dashed border-[#1f4d3f] bg-[#f4efe5] px-4 py-3">
          <p className="text-lg font-semibold leading-snug text-[#171f1d]">Crisis response</p>
          <p className="mt-1 text-base leading-6 text-[#365548]">Agree on limits with your supervisor</p>
        </div>
        <div className="mt-4 rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] p-4">
          <p className="text-base font-semibold leading-6 text-[#171f1d]">You work through</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {partners.map((name) => (
              <li
                key={name}
                className="rounded-[8px] border border-[#d9cdb8] bg-white px-3 py-2 text-base leading-6 text-[#171f1d]"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-3 text-base leading-6 text-[#365548]">
        Roles from CSDE (2025), p. 4. Crisis note from p. 5.
      </figcaption>
    </figure>
  );
}
