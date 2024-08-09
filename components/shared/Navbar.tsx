import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-8 h-8" // Custom width and height
    },
  };
  return (
    <header className="shadow-sm">
      <nav className="wrapper flex flex-row justify-between items-center py-4">
        <p>LOGO</p>
        <div className="flex flex-row gap-3">
          <ModeToggle />
          <UserButton appearance={userButtonAppearance}/>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
