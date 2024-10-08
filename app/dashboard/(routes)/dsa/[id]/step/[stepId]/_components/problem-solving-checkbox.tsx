"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { toggleSolver } from "@/action/content/dsa";

interface ProblemCheckboxProps {
  checked: boolean;
  Probid: string;
}

const ProblemCheckbox: React.FC<ProblemCheckboxProps> = ({ checked, Probid }) => {


  console.log({
    checked,
    Probid
  })
  const [isChecked, setIsChecked] = useState(checked);
  const user = useCurrentUser();


  useEffect(()=>{
    setIsChecked(checked)
  },[isChecked , checked])

  const handleCheckboxChange = async () => {
    try {
      const response = await toggleSolver(Probid, user?.id, !isChecked);

      if (response.success) {
        setIsChecked(!isChecked);
      } else {
        console.error('Failed to update problem status:', response.error);
      }
    } catch (error) {
      console.error('Error updating problem status:', error);
    }
  };

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleCheckboxChange}
    />
  );
};

export default ProblemCheckbox;
