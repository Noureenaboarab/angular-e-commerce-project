import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Structural Directive: appIf
 * A custom re-implementation of *ngIf.
 *
 * Usage:
 *   <div *appIf="someCondition">Visible when true</div>
 */
@Directive({ selector: '[appIf]', standalone: true })
export class AppIfDirective implements OnChanges {
  @Input() appIf: boolean = false;

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appIf']) {
      if (this.appIf && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!this.appIf && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    }
  }
}
