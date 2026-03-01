import BackGround from "./components/banner/backGround";
import Title from "./components/banner/Title";
import Search from "./components/banner/search";
  export default function HomePage() {
  return (
    <div className="">
      <BackGround />
      <div className="max-w-7xl mx-auto mt-20 lg:mt-50 relative z-20 px-6 overflow-hidden">
      <Title />
      <Search />
      <p className="text-sm font-semibold text-gray-500 mt-1.5 opacity-65">Popular : UI Designer, UX Researcher, Android, Admin, Developer.</p>
      </div>
    </div>
  );
}   
