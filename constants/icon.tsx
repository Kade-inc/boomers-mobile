import { Feather } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

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
    arrowRight: (props:any) => <Feather name="arrow-right" size={18}  {...props} />,
    downCircle: (props:any) => <AntDesign name="downcircle" size={24} {...props} />,
    upCircle: (props:any) => <AntDesign name="upcircle" size={24} {...props} />
  }