import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdMoon } from "react-icons/io";
import { MdSunny } from "react-icons/md";
import { User, LogOut } from "lucide-react";

interface Props {
  session: any;
  signOut: () => void;
}

const Header: React.FC<Props> = ({ session, signOut }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {session.user?.name}!
        </h1>
        <p className="text-muted-foreground mt-1">Manage your todos</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          className="h-10 w-10 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <IoMdMoon className="text-accent-foreground" />
          ) : (
            <MdSunny className="text-accent-foreground" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 text-accent-foreground">
                <AvatarImage
                  src={session.user?.image}
                  alt={session.user?.name}
                />
                <AvatarFallback>
                  {session.user?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
