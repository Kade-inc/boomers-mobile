import { Feather, AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface IconProps {
  color?: string;
  size?: number;
  [key: string]: any;
}

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
    upCircle: (props:any) => <AntDesign name="upcircle" size={24} {...props} />,
    clock: (props:any) => <Feather name="clock" size={24}  {...props} />,
    xCircle: (props:any) => <Feather name="x-circle" size={24} {...props} />,
    arrowLeft: ({ color, size = 24, ...props }: IconProps) => (
        <Feather name="arrow-left" size={size} color={color} {...props} />
    ),
}