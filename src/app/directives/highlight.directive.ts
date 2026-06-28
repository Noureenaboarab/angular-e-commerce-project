import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * Attribute Directive: appHighlight
 * Changes an element's background on mouse-enter / mouse-leave.
 *
 * Usage:
 *   <div appHighlight highlightColor="#e0f2fe"> ... </div>
 */
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @Input() highlightColor: string = '#eff6ff';

  private originalBg = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onEnter(): void {
    this.originalBg = this.el.nativeElement.style.backgroundColor;
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.25s ease');
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalBg);
  }
}
