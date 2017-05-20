{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE NoImplicitPrelude #-}

module WhimServer where

import ClassyPrelude

import Control.Monad.IO.Class (liftIO)
import System.Environment (getEnv)
import Twilio
import Twilio.Messages
import qualified Web.Scotty as W

main :: IO ()
main =
  W.scotty 3000 $
    W.get "/whim" $ liftIO sendMessage

sendMessage :: IO ()
sendMessage = runTwilio' (getEnv "ACCOUNT_SID")
                  (getEnv "AUTH_TOKEN") $ do
  let body = PostMessage "+15126664565" "+15126669446" "Oh, hai"
  message <- post body
  liftIO $ print message
