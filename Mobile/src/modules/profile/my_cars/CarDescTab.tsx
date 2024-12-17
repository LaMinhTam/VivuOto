import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const CarDescTab = ({ richText, description, setDescription }: { richText: React.RefObject<RichEditor>, description: string, setDescription: (value: string) => void }) => {

    const handleChange = (text: string) => {
        setDescription(text);
    };

    return (
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={() => richText?.current?.focusContentEditor()}>
                <RichEditor
                    ref={richText}
                    initialContentHTML={description}
                    onChange={handleChange}
                    placeholder="Enter car description here..."
                    editorStyle={{ backgroundColor: '#fff', color: '#333' }}
                    style={styles.editor}
                />
            </TouchableWithoutFeedback>
            <RichToolbar
                editor={richText}
                selectedIconTint="#0068ff"
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.insertImage,
                ]}
                style={styles.toolbar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    editor: { flex: 1, padding: 10, minHeight: 200 },
    toolbar: { borderTopColor: '#eee', borderTopWidth: 1, backgroundColor: '#f9f9f9' },
});

export default CarDescTab;
