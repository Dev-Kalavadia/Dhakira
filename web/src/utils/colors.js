const tintColor = '#5f27cd';
const link="blue";
const faintedTextColor="#555";
const defaultBackground="rgb(246,246, 246)";
const difficultyLevels=["rgba(0, 128, 0, 0.8)", "rgba(0, 139, 139, 0.8)", "rgba(205, 92, 92,0.8)"];

const Color = {
    tintColor,
    //general
    listBackground:'#F2F2F2',
    difficultyLevels,

    //ends general
    primary: '#7000e3',
    buttonEnable: '#F83B73',
    badge: '#F83B73',
    chatBubbleRightBackground: '#7000e3',
    heart: '#7000e3',
    //Side Menu
    sideMenuBackground: '#fff',
    sideMenuBorderBottom: 'transparent',
    sideMenuText: '#000',
    backgroundColor: '#F2F2F2',
    faintedTextColor,
    white:"#fff",
    default:'rgb(160,60,0)',
    red:"red",
    //notifications
    navigation:"white",
    navigationText:"black",
    gray:"gray",
    success:"blue",
    info:"green",
    warning:"red",
    danger:"red",
    received:"green",
    pending:"black",
    verified:"blue",
    verified_offline:"gray",
    verified_online:"green",
    clickableIcon:"blue",
    link,
    //tabs
    tabActiveBgColor:"white",
    tabBarActiveTextColor:link,
    sTabBarActiveTextColor:link,
    tabBarTextColor:faintedTextColor,
    footerBackground:defaultBackground,
    listItemBackground:"white",
    listItemsBackground:defaultBackground,
    tag:"rgb(224,224,224)",
    //general
    defaultBackground, //"rgb(220,120,0)" //,

}
export default Color;
