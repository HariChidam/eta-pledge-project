import React from "react";
import { useEffect } from "react";
import supabase from "../../supabase.js";




export default function Home() {
  useEffect(() => {
    const checkIfBrother = async () => {
      const { data, error } = await supabase.from('test').select('*')

        if (data) {
          console.log(data)
        }
    }

    checkIfBrother()
  }, [])

  return (
      <div className="pl-20 flex flex-row items-center text-center font-sans font-bold">
          Hari is awesome
      </div>
  );
}
