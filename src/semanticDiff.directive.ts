import { Directive, ElementRef, Input } from '@angular/core';
import { DiffMatchPatchService } from './diffMatchPatch.service';
import { Diff, DiffOp } from './diffMatchPatch';

@Directive({
  selector: '[semanticDiff]'
})
export class SemanticDiffDirective { 
  @Input() left: string | number | boolean;
  @Input() right: string | number | boolean;

  constructor(private el: ElementRef, private dmp: DiffMatchPatchService) {  }

  ngOnInit () {
    if(!this.left) this.left = "";
    if(!this.right) this.right = "";
    if(typeof this.left === 'number' || typeof this.left === 'boolean') this.left = this.left.toString();
    if(typeof this.right === 'number' || typeof this.right === 'boolean') this.right = this.right.toString();
    this.el.nativeElement.innerHTML = this.createHtml(this.dmp.getSemanticDiff(this.left, this.right));
  }

  // TODO: Need to fix this for line diffs
  createHtml (diffs: Array<Diff>) {
    let html: string;
    html = '<div>';
    for(let diff of diffs) {
      diff[1] = diff[1].replace(/\n/g, '<br/>');

      if(diff[0] === DiffOp.Equal) {
        html += diff[1];
      }
      if(diff[0] === DiffOp.Delete) {
        html += '<del>' + diff[1] + '</del>';
      }
      if(diff[0] === DiffOp.Insert) {
        html += '<ins>' + diff[1] + '</ins>';
      }
    }
    html += '</div>';
    return html;
  }
}
