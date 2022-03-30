import { style, animate, animation, } from "@angular/animations";

export const fadeDownIn = animation([
    style({
        overflow: 'hidden',
        height: '0px',
        opacity: '0'
    }),
    animate('{{duration}} ease-in-out',
        style({
            overflow: 'hidden',
            height: '*',
            opacity: '1'
        }))
]);

export const fadeUpOut = animation([
    style({
        overflow: 'hidden',
        height: '*',
        opacity: '1'
    }),
    animate('{{duration}} ease-in-out',
        style({
            overflow: 'hidden',
            height: '0px',
            opacity: '0'
        })
    )
]);
