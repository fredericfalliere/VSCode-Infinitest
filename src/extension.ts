import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  console.log('Activate !!!!');

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = 'InfiniTest';
  statusBarItem.show();

  console.log('Congratulations, your extension "infinitest" is now active!');

  let onDidSaveTextDocument = vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.languageId !== 'typescript') {
      statusBarItem.text = 'InfiniTest';
      return;
    }

    const filePath = document.uri.fsPath;
    const testFilePath = await figureOutTestFilePath(filePath);

    if (testFilePath) {
      runTest(testFilePath, statusBarItem);
    } else {
      statusBarItem.text = '$(circle-slash) No test found';
    }
  });

  context.subscriptions.push(statusBarItem, onDidSaveTextDocument);
}

export function deactivate() {}

async function figureOutTestFilePath(filePath: string): Promise<string | null> {
  if (filePath.endsWith('.spec.ts')) {
    return filePath;
  }

  if (filePath.endsWith('.e2e-spec.ts')) {
    return filePath;
  }

  const testFilePath = filePath.replace(/\.ts$/, '.spec.ts');
  console.log(`Stat on ${testFilePath}`);
  try {
    return await vscode.workspace.fs
      .stat(vscode.Uri.file(testFilePath))
      .then(() => testFilePath);
  } catch (err) {
    return null;
  }
}

function runTest(testFilePath: string, statusBarItem: vscode.StatusBarItem) {
  statusBarItem.text = '$(sync~spin) Running test.';

  const isE2e = testFilePath.indexOf('e2e-spec.ts') > 0;
  const cwd = testFilePath.substring(0, testFilePath.lastIndexOf('/'));
  const testFileSuffix = isE2e ? 'e2e-spec.ts' : '.spec.ts';
  const testFileName = testFilePath.substring(
    testFilePath.lastIndexOf('/') + 1,
    testFilePath.lastIndexOf(testFileSuffix) + testFileSuffix.length
  );
  const npmCommand = isE2e ? 'npm run test:e2e --t' : 'npm run test --';
  const execCommand = `${npmCommand} ${testFileName}`;
  console.log('execCommand', execCommand);

  exec(
    execCommand,
    {
      cwd,
    },
    (error, stdout: string, stderr: string) => {
      if (error) {
        console.log('Error', error);
        statusBarItem.text = '$(error) Fail';
      } else {
        statusBarItem.text = '$(check) Passed';
      }
      console.log('Standard out :');
      console.log(stdout);
    }
  );
}
