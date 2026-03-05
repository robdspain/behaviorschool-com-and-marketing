"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GRADE_LEVEL_OPTIONS, INITIAL_WIZARD_DATA, type GradeLevel } from "@/components/act-fba-bip/actBipGenerator";

const gradeMap: Record<string, GradeLevel> = {
  "1st": "1-3",
  "2nd": "1-3",
  "3rd": "1-3",
  "4th": "4-5",
  "5th": "4-5",
  "6th": "6-8",
  "7th": "6-8",
  "8th": "6-8",
  "9th": "9-12",
  "10th": "9-12",
  "11th": "9-12",
  "12th": "9-12",
};

export function HeroStudentForm() {
  const router = useRouter();
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentGrade, setStudentGrade] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("6-8");
  const [school, setSchool] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [teamMembers, setTeamMembers] = useState("");

  const handleNext = () => {
    const updatedData = {
      ...INITIAL_WIZARD_DATA,
      profile: {
        studentName,
        studentAge,
        studentGrade,
        gradeLevel,
        school,
        assessmentDate,
        teamMembers,
      },
    };

    localStorage.setItem("act-fba-bip-data", JSON.stringify(updatedData));
    localStorage.setItem("act-fba-bip-student-info", JSON.stringify(updatedData.profile));

    router.push("/act-fba-bip/wizard");
  };

  const isValid = studentName.trim().length > 1;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Student Name *</Label>
          <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Age</Label>
          <Input value={studentAge} onChange={(e) => setStudentAge(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Grade</Label>
          <Input
            value={studentGrade}
            onChange={(e) => {
              const raw = e.target.value;
              setStudentGrade(raw);
              if (gradeMap[raw]) setGradeLevel(gradeMap[raw]);
            }}
            placeholder="e.g., 6th"
          />
        </div>
        <div className="space-y-2">
          <Label>Grade Band</Label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            {GRADE_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>School</Label>
          <Input value={school} onChange={(e) => setSchool(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Assessment Date</Label>
          <Input type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Assessor and Team</Label>
          <Input value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} placeholder="BCBA, teacher, caregiver" />
        </div>
      </div>

      <Button
        onClick={handleNext}
        disabled={!isValid}
        className="bg-[#1E3A34] hover:bg-[#173029] w-full"
      >
        Next
      </Button>
    </div>
  );
}
