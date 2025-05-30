import { Feather } from "@expo/vector-icons";

export const icon = {
    index: (props:any) => <Feather name="home" size={24}  {...props} />,
    teams: (props:any) => <Feather name="users" size={24}  {...props} />,
    search: (props:any) => <Feather name="search" size={24}  {...props} />,
    messages: (props:any) => <Feather name="mail" size={24}  {...props} />,
    profile: (props:any) => <Feather name="user" size={24}  {...props} />,
    bell: (props:any) => <Feather name="bell" size={24}  {...props} />,
    send: (props:any) => <Feather name="send" size={24}  {...props} />,
    zap: (props:any) => <Feather name="zap" size={24}  {...props} />,
    smile: (props:any) => <Feather name="smile" size={24}  {...props} />,
  }