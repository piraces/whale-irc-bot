/**
 * deps.ts
 *
 * This module re-exports the required methods from the dependant remote IRC and log module.
 **/
export { Client } from "https://deno.land/x/irc/mod.ts";
export * as log from "https://deno.land/std/log/mod.ts";
