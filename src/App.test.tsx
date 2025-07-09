

import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Idol Post Generator', () => {
  // localStorageのモック
  let store: Record<string, string> = {};
  const localStorageMock = (() => {
    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      }
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(() => {
    // 各テストの前にlocalStorageをクリア
    store = {};
    render(<App />);
  });

  test('should generate post text with basic info and selected members', async () => {
    // 1. 入力
    fireEvent.change(screen.getByLabelText('日付'), { target: { value: '2025-07-10' } });
    fireEvent.change(screen.getByLabelText('ライブタイトル'), { target: { value: '定期公演' } });
    fireEvent.change(screen.getByPlaceholderText('会場名など'), { target: { value: '銀河劇場' } });
    fireEvent.click(screen.getByLabelText('大谷 映美里'));
    fireEvent.click(screen.getByLabelText('佐々木 舞香'));

    // 2. 生成されたテキストエリアを取得
    const generatedTextArea = await screen.findByRole('textbox', { name: '生成された投稿' }) as HTMLTextAreaElement;

    // 3. 検証
    const expectedText = [
      '2025/07/10',
      '定期公演',
      '@ 銀河劇場',
      '',
      '大谷 映美里 (@otani_emiri)さん',
      '佐々木 舞香 (@sasaki_maika)さん',
      '',
      '#イコラブ #イコラブ_カメコ'
    ].join('\n');

    expect(generatedTextArea.value).toBe(expectedText);
  });

  test('should handle options and custom hashtags correctly', async () => {
    // 1. 入力
    fireEvent.change(screen.getByLabelText('日付'), { target: { value: '2025-07-11' } });
    fireEvent.change(screen.getByLabelText('ライブタイトル'), { target: { value: '特別公演' } });
    fireEvent.change(screen.getByPlaceholderText('会場名など'), { target: { value: '武道館' } });

    // 2. グループとメンバーを選択
    fireEvent.change(screen.getByLabelText('グループ'), { target: { value: 'ノイミー' } });
    await screen.findByText('尾木 波菜'); // グループ変更後の再レンダリングを待つ
    fireEvent.click(screen.getByLabelText('冨田 菜々風'));

    // 3. オプションを変更
    fireEvent.click(screen.getByLabelText('メンバー名をハッシュタグにする'));
    fireEvent.click(screen.getByLabelText('敬称とXアカウントを逆にする'));
    fireEvent.change(screen.getByLabelText('敬称'), { target: { value: 'ちゃん' } });

    // 4. カスタムハッシュタグを追加
    fireEvent.change(screen.getByLabelText('追加ハッシュタグ (スペースかカンマ区切り)'), { target: { value: 'かわいい 超絶イケメン' } });

    // 5. 生成されたテキストエリアを取得
    const generatedTextArea = await screen.findByRole('textbox', { name: '生成された投稿' }) as HTMLTextAreaElement;

    // 6. 検証
    const expectedText = [
        '2025/07/11',
        '特別公演',
        '@ 武道館',
        '',
        '#冨田菜々風 ちゃん (@tomita_nanaka_)',
        '',
        '#ノイミー #ノイミー_カメコ #かわいい #超絶イケメン'
    ].join('\n');

    expect(generatedTextArea.value).toBe(expectedText);
  });

  test('should toggle parentheses for account', async () => {
    fireEvent.change(screen.getByLabelText('グループ'), { target: { value: 'ニアジョイ' } });
    await screen.findByText('逢田 珠里依'); // Wait for re-render
    fireEvent.click(screen.getByLabelText('市原 愛弓'));

    // Disable parentheses
    fireEvent.click(screen.getByLabelText('Xアカウントを()で囲う'));

    const generatedTextArea = await screen.findByRole('textbox', { name: '生成された投稿' }) as HTMLTextAreaElement;

    expect(generatedTextArea.value).toContain('市原 愛弓 @ichihara_ayumi_さん');

    // Re-enable parentheses
    fireEvent.click(screen.getByLabelText('Xアカウントを()で囲う'));
    expect(generatedTextArea.value).toContain('市原 愛弓 (@ichihara_ayumi_)さん');
  });
});
