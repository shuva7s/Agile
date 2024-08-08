import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  return (
    <header className="shadow-sm">
      <nav className="wrapper flex flex-row justify-between items-center py-4">
        <p>LOGO</p>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
