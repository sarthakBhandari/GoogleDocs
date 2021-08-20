import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import { useSession, signOut } from "next-auth/client";

const Header = () => {
  const [session] = useSession();

  return (
    <header className="flex sticky top-0 z-50 px-4 py-2 items-center bg-white shadow-md">
      <Button
        color="gray"
        buttonType="outline"
        rounded={true}
        iconOnly={true}
        ripple="dark"
        className="h-20 w-20 border-0"
      >
        <Icon name="menu" size="3xl" />
      </Button>
      <Icon name="description" size="5xl" color="blue" />
      <h1 className="ml-2 text-gray-700 text-2xl">Docs</h1>
      <div className="flex flex-grow items-center px-5 py-2 bg-gray-100 rounded-lg mx-5 md:mx-20 focus-within:shadow-md focus-within:text-gray-600">
        <Icon name="search" size="3xl" color="gray" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none text-base bg-transparent px-5 flex-grow"
        />
      </div>

      <Button
        color="gray"
        buttonType="outline"
        rounded={true}
        iconOnly={true}
        ripple="dark"
        className="h-20 w-20 border-0 ml-5 md:ml-20"
      >
        <Icon name="apps" size="3xl" color="gray" />
      </Button>

      <img
        onClick={signOut}
        loading="lazy"
        className="cursor-pointer h-12 w-12 rounded-full ml-2 object-cover"
        src={session.user.image}
        alt=""
      />
    </header>
  );
};

export default Header;
