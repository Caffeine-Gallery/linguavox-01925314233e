import Array "mo:base/Array";
import Hash "mo:base/Hash";

import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor TranslationManager {
  stable var translationsEntries : [(Text, Text)] = [];
  let translations = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash);

  public func addTranslation(key: Text, value: Text) : async () {
    translations.put(key, value);
  };

  public query func getTranslation(key: Text) : async ?Text {
    translations.get(key)
  };

  system func preupgrade() {
    translationsEntries := Iter.toArray(translations.entries());
  };

  system func postupgrade() {
    for ((k, v) in translationsEntries.vals()) {
      translations.put(k, v);
    };
  };
}
