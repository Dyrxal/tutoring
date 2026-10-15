import {BookOpen, Bird, Cat, CircleUserRound, Fish, Leaf, Rocket, Star} from "lucide-react";

export const studentAvatars=[
 {key:"book",label:"Book",Icon:BookOpen,color:"blue"},
 {key:"owl",label:"Owl",Icon:Bird,color:"violet"},
 {key:"cat",label:"Cat",Icon:Cat,color:"rose"},
 {key:"fish",label:"Fish",Icon:Fish,color:"cyan"},
 {key:"leaf",label:"Leaf",Icon:Leaf,color:"green"},
 {key:"rocket",label:"Rocket",Icon:Rocket,color:"amber"},
 {key:"star",label:"Star",Icon:Star,color:"indigo"},
 {key:"person",label:"Person",Icon:CircleUserRound,color:"slate"},
] as const;
export type StudentAvatarKey=typeof studentAvatars[number]["key"];
export function StudentAvatar({avatarKey,name="Student",size="md"}:{avatarKey?:string|null;name?:string;size?:"sm"|"md"|"lg"}){
 const chosen=studentAvatars.find(item=>item.key===avatarKey)||studentAvatars[0];
 const Icon=chosen.Icon;
 return <span className={`student-avatar avatar-${chosen.color} avatar-${size}`} role="img" aria-label={`${name}'s ${chosen.label.toLowerCase()} avatar`}><Icon aria-hidden="true" size={size==="sm"?16:size==="lg"?27:21}/></span>;
}
