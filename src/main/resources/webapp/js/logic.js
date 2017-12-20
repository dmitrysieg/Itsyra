define([
    'logic/animationcontroller',
    'logic/building',
    'logic/uicontrols',
    'logic/arrows',
    'logic/shapehelper'
], function(
    AnimationController,
    Building,
    UIControls,
    Arrows,
    ShapeHelper
) {
    return {
        AnimationController: AnimationController,
        Building: Building,
        UIControls: UIControls,
        Arrows: Arrows,
        ShapeHelper: ShapeHelper
    };
});