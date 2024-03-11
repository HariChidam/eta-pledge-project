import React from "react";
import { useEffect } from "react";
import supabase from "../../supabase.js";
import Image from "next/image.js";
import isaac from "../../public/isaac.jpeg"




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
      <div className="flex flex-col items-center text-center">
          <h1 className="text-center font-sans font-bold text-6xl pt-20 pb-20">
              Happy Birthday Isaac!!!!!
          </h1>
          <Image src={isaac} alt="Isaac" width={300} height={300} className="rounded-sm" />
      </div>
  );
}
