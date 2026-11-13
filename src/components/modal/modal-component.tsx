import { Component, Prop, Method, h } from '@stencil/core';

@Component({
  tag: 'modal-component',
  styleUrl: 'modal-component.css',
  shadow: true,
})
export class ModalComponent {
  @Prop({ mutable: true }) open: boolean = false;

  @Method()
  async showModal() {
    this.open = true;
    this.dialogEl?.showModal();
  }

  @Method()
  async close() {
    this.open = false;
    this.dialogEl?.close();
  }

  private handleClose = () => {
    this.open = false;
  };

  private dialogEl?: HTMLDialogElement;

  componentDidLoad() {
    // this.dialogEl is already populated by the ref in render()
    if (this.dialogEl && this.open) {
      this.dialogEl.showModal();
    }
  }

  render() {
    return (
      <dialog ref={(el) => (this.dialogEl = el as HTMLDialogElement)}>
        <button class="button button--round" type="button" aria-label="Close" onClick={this.handleClose}>×</button>
        <slot></slot>
      </dialog>
    );
  }
}