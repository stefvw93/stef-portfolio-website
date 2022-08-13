let doCreateGlobalEvents = true;

export enum AnimationEvent {
  PreloadComplete = "animation-preload-complete",
}

export const globalEvents = new Map<AnimationEvent, Event>();

export function createGlobalEvents() {
  if (!doCreateGlobalEvents) return;
  doCreateGlobalEvents = false;
  Object.values(AnimationEvent).forEach((value) =>
    globalEvents.set(value, new Event(value))
  );
}

export function getAnimationEvent(event: AnimationEvent) {
  return globalEvents.get(event);
}

export function dispatchAnimationEvent(event: AnimationEvent) {
  const _event = getAnimationEvent(event);
  if (!_event) {
    return console.error(`Unknown event ${event}`);
  }
  window.dispatchEvent(_event);
}
