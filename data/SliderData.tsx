import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
    title: string;
    image: ImageSourcePropType;
    description: string;
}

export const SliderData = [
    {
        title: 'This is the first',
        image: require('@/assets/images/adam.jpg'),
        description: 'First riles'
    },
    {
        title: 'This is the second',
        image: require('@/assets/images/boe.jpg'),
        description: 'Second riles'
    },
    {
        title: 'This is the third',
        image: require('@/assets/images/logan.jpg'),
        description: 'Third riles'
    },
    {
        title: 'This is the fourth',
        image: require('@/assets/images/maksim.jpg'),
        description: 'Fourth riles'
    }
]