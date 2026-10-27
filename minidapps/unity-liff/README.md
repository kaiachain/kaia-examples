# Unity LIFF Mini dApp

Unity WebGL plugin and C# manager that connect a Unity game to a Kaia wallet inside a LINE LIFF app.

Docs: [Convert to LINE LIFF](https://docs.kaia.io/minidapps/unity/convert-unity-liff/)

Originally published as a [gist](https://gist.github.com/ayo-klaytn/2aad97e1e263b00f5403177a7ad1fff1).

## Files

- `Assets/Plugins/KaiaPlugin.jslib` – JavaScript bridge called from Unity (connect, disconnect, mint, balance)
- `Assets/Scripts/Web3Manager.cs` – MonoBehaviour that calls the plugin and receives callbacks

## Usage

Copy the `Assets/` folders into your Unity project, attach `Web3Manager` to a GameObject named `Web3Manager`, and follow the docs to set up the WebGL template and LIFF app.
