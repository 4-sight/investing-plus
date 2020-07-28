import { Context } from "../Classes";
import commandHandler from "./commandHandler";
import { logger } from "../utils";

commandHandler(new Context());
logger("CONTENT SCRIPT");
