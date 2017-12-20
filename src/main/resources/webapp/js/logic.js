define([
    'logic/animationcontroller',
    'logic/building',
    'logic/uicontrols',
    'logic/arrows'
], function(
    AnimationController,
    Building,
    UIControls,
    Arrows
) {
    return {
        AnimationController: AnimationController,
        Building: Building,
        UIControls: UIControls,
        Arrows: Arrows
    };
});