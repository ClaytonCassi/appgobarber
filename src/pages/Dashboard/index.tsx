import React from 'react';
import { View, Button} from 'react-native';
import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {
    const { SignOut } = useAuth();

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title="Sair" onPress={SignOut} />
      </View>
    )
}
export default Dashboard;