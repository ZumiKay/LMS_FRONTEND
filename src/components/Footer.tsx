export default function FooterComponent() {
  return (
    <div
      className="w-full h-fit font-sans p-2 border-t-2  border-gray-300 text-black flex flex-row items-center 
    justify-between gap-5 relative bottom-0 max-sm:flex-col max-sm:justify-start max-sm:items-start"
    >
      <div className="w-[90%] h-fit text-left">
        <p className="w-full h-fit text-sm font-normal">
          {`Track Student Usage of Paragon.U Library`}
        </p>
        <p className="w-full h-fit text-sm font-bold">{`Proof of Concept`}</p>
      </div>
      <p className="w-fit h-fit text-sm font-normal text-right">
        Copyright © 2024
      </p>
    </div>
  );
}
